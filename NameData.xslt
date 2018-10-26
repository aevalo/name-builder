<xsl:stylesheet version="1.1" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="text" omit-xml-declaration="yes" />
  <xsl:template match="/">
  {
    <xsl:apply-templates select="NameData/PhonemeList" />,
    <xsl:apply-templates select="NameData/NameTemplateList" />
  }
  </xsl:template>

  <xsl:template match="PhonemeList">
    "phoneme-list": [
      <xsl:apply-templates select="Phoneme" />
    ]
  </xsl:template>

  <xsl:template match="Phoneme">
    {
      "name": "<xsl:value-of select="@Name" disable-output-escaping="yes" />",
      "parts": [
        <xsl:apply-templates select="Part" />
      ]
    }
    <xsl:if test="position() != last()">
        <xsl:text>, </xsl:text>
    </xsl:if>
  </xsl:template>

  <xsl:template match="Phoneme/Part">
    "<xsl:value-of select="." disable-output-escaping="yes" />"
    <xsl:if test="position() != last()">
        <xsl:text>, </xsl:text>
    </xsl:if>
  </xsl:template>

  <xsl:template match="NameTemplateList">
    "name-template-list": [
      <xsl:apply-templates select="NameTemplate" />
    ]
  </xsl:template>

  <xsl:template match="NameTemplate">
    {
      "name": "<xsl:value-of select="@Name" disable-output-escaping="yes" />",
      "parts": [
        <xsl:apply-templates select="Part" />
      ]
    }
    <xsl:if test="position() != last()">
        <xsl:text>, </xsl:text>
    </xsl:if>
  </xsl:template>

  <xsl:template match="NameTemplate/Part">
    {
      "type": "<xsl:value-of select="@Type" disable-output-escaping="yes" />",
      "phoneme": "<xsl:value-of select="." disable-output-escaping="yes" />"
    }
    <xsl:if test="position() != last()">
        <xsl:text>, </xsl:text>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>
